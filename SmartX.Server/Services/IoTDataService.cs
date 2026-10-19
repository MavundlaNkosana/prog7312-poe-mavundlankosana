using System;
using System.Collections.Generic;
using System.Linq;

namespace SmartX.Server.Services
{
    // A DTO to store commands in the Stack
    public class CommandRecord
    {
        public string MacAddress { get; set; } = string.Empty;
        public string CommandAction { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }

    public class IoTDataService
    {
        private readonly object _lockObject = new object();

        // 1. Queues and Priority Queues
        public Queue<float> StandardTelemetryQueue { get; private set; } = new Queue<float>();

        // Priority Queue for critical alerts
        public PriorityQueue<float, int> CriticalAlertQueue { get; private set; } = new PriorityQueue<float, int>();

        // Stack for LIFO command history allowing "Undo" functionality
        public Stack<CommandRecord> CommandHistoryStack { get; private set; } = new Stack<CommandRecord>();

        // 2. Hash Tables, Dictionaries, Sorted Dictionaries
        public Dictionary<string, string> LiveDevicesMap { get; private set; } = new Dictionary<string, string>();

        public SortedDictionary<DateTime, string> HistoricalLogs { get; private set; } = new SortedDictionary<DateTime, string>();

        // 3. Sets
        public HashSet<string> ActiveErrorStates { get; private set; } = new HashSet<string>();

        // 4. Predictive Action Engine logic
        public Dictionary<string, int> PatternFrequency { get; private set; } = new Dictionary<string, int>();

        public void IngestTelemetry(string mac, float value)
        {
            lock (_lockObject)
            {
                // Register to O(1) dictionary
                if (!LiveDevicesMap.ContainsKey(mac))
                    LiveDevicesMap.Add(mac, "Active");

                // Route based on criticality
                if (value > 35.0f || value > 1500.0f) // Simulated Critical Thresholds
                {
                    CriticalAlertQueue.Enqueue(value, 1); // High priority
                    ActiveErrorStates.Add(mac); // HashSet prevents duplicates naturally

                    // Add to predictive pattern analysis (e.g. "Spike observed on MAC")
                    PatternFrequency[$"Spike_{mac}"] = PatternFrequency.GetValueOrDefault($"Spike_{mac}", 0) + 1;
                }
                else
                {
                    StandardTelemetryQueue.Enqueue(value);
                    ActiveErrorStates.Remove(mac); // Clear error if stabilized
                }

                HistoricalLogs.Add(DateTime.UtcNow, $"Ingested {value} from {mac}");
            }
        }

        public void IssueCommand(string mac, string action)
        {
            lock (_lockObject)
            {
                // Push to Stack for undo capabilities
                CommandHistoryStack.Push(new CommandRecord
                {
                    MacAddress = mac,
                    CommandAction = action,
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        public CommandRecord? UndoLastCommand()
        {
            lock (_lockObject)
            {
                if (CommandHistoryStack.Count > 0)
                {
                    return CommandHistoryStack.Pop();
                }
                return null;
            }
        }

        public List<string> GeneratePredictiveInsights()
        {
            lock (_lockObject)
            {
                var insights = new List<string>();

                var frequentIssues = PatternFrequency.Where(p => p.Value > 3).ToList();
                foreach (var issue in frequentIssues)
                {
                    insights.Add($"Pattern detected: {issue.Key} has spiked {issue.Value} times recently. Recommend automated throttle rule.");
                }

                if (!insights.Any())
                {
                    insights.Add("System stable. No persistent anomalous patterns detected in historical cache.");
                }

                return insights;
            }
        }
    }
}