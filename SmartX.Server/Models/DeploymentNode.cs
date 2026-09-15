using System;
using System.Collections.Generic;

namespace SmartX.Server.Models
{

    public class DeploymentNode
    {
        public string NodeName { get; set; }
        public List<DeploymentNode> Children { get; set; } = new List<DeploymentNode>();

        // Default constructor for serialization
        public DeploymentNode() { }

        public DeploymentNode(string name)
        {
            NodeName = name;
        }

        // Recursive search algorithm
        public bool ValidateDeploymentPath(string targetZone)
        {
            // Base Case: Match found at current node
            if (this.NodeName.Equals(targetZone, StringComparison.OrdinalIgnoreCase))
                return true;

            // Recursive Case: Deep-search all child nodes
            foreach (var child in Children)
            {
                if (child.ValidateDeploymentPath(targetZone))
                    return true;
            }

            // Target not found in this branch
            return false;
        }
    }
}