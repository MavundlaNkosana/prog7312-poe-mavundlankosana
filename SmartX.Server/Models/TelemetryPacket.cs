using System;

namespace SmartX.Server.Models
{
   
    public class TelemetryPacket<T> where T : struct
    {
        public string MacAddress { get; set; }
        public DateTime Timestamp { get; set; }
        public T PayloadValue { get; set; }

        public TelemetryPacket()
        {
            Timestamp = DateTime.UtcNow;
        }

        public TelemetryPacket(string macAddress, T value)
        {
            MacAddress = macAddress;
            Timestamp = DateTime.UtcNow;
            PayloadValue = value;
        }

        public static TelemetryPacket<T> operator +(TelemetryPacket<T> a, TelemetryPacket<T> b)
        {
            if (a == null || b == null) throw new ArgumentNullException("Packets cannot be null");

            dynamic valA = a.PayloadValue;
            dynamic valB = b.PayloadValue;

            return new TelemetryPacket<T>(
                $"AGGREGATE_{a.MacAddress}_{b.MacAddress}",
                (T)(valA + valB)
            );
        }

        public static TelemetryPacket<T> operator -(TelemetryPacket<T> a, TelemetryPacket<T> b)
        {
            if (a == null || b == null) throw new ArgumentNullException("Packets cannot be null");

            dynamic valA = a.PayloadValue;
            dynamic valB = b.PayloadValue;

            
            dynamic absoluteDiff = valA > valB ? (valA - valB) : (valB - valA);

            return new TelemetryPacket<T>(
                $"DELTA_{a.MacAddress}_{b.MacAddress}",
                (T)absoluteDiff
            );
        }
    }
}