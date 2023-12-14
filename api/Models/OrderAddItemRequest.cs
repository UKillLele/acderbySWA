﻿using System.Collections.Generic;

namespace acderby.Models
{
    public class OrderAddItemRequest
    {
        public string OrderId { get; set; }
        public int? Version { get; set; }
        public List<OrderItem> Items { get; set; }
    }

    public class OrderItem
    {
        public string LineItemId { get; set; }
        public string Uid { get; set; }
        public string Quantity { get; set; }
    }
}
