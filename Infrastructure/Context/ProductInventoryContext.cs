using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BillingApplication.Model;

    public class ProductInventoryContext : DbContext
    {
        public ProductInventoryContext (DbContextOptions<ProductInventoryContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Product { get; set; }
    public DbSet<Invoice> Invoice { get; set; }
    public DbSet<ProductInvoice> ProductInvoice { get; set; }
    }
