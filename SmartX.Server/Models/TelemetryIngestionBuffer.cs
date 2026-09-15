using System;
using System.Collections.Generic;

namespace SmartX.Server.Models
{

    public class TelemetryIngestionBuffer
    {
        private float[][] _rawBatchBuffer = new float[5][];
        private readonly object _lockObject = new object();

        public void ReceiveBatch(int gatewayIndex, float[] incomingDataBurst)
        {
            if (gatewayIndex < 0 || gatewayIndex >= _rawBatchBuffer.Length)
                throw new ArgumentOutOfRangeException(nameof(gatewayIndex), "Invalid Gateway ID.");

            lock (_lockObject)
            {
                _rawBatchBuffer[gatewayIndex] = incomingDataBurst;
            }
        }

        public List<float> FlushToOptimizedList()
        {
            List<float> optimizedStorage = new List<float>();

            lock (_lockObject)
            {
                for (int i = 0; i < _rawBatchBuffer.Length; i++)
                {
                    if (_rawBatchBuffer[i] != null)
                    {
                        optimizedStorage.AddRange(_rawBatchBuffer[i]);

                        _rawBatchBuffer[i] = null;
                    }
                }
            }
            return optimizedStorage;
        }
    }
}