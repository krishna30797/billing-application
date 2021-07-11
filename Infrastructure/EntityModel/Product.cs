using BillingApplication.APIModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Model
{
    public class Product
    {
        [Key]
        public int id { get; set; }
        public string ProductCode { get; set; }
        public string ProductDescription { get; set; }
        public decimal Price { get; set; }
        public Units Units { get; set; }
    }
}
