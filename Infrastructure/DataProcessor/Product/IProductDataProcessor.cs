using BillingApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Data
{
    public interface IProductDataProcessor
    {
        public List<Product> CreateProduct(Product product);
        public List<Product> UpdateProduct(Product product);
        public List<Product> DeleteProduct(int id);
        public Product GetProductById(int id);
        public List<Product> GetAllProducts();
        public  List<Product> GetProductBySearch(string? searchParam);
    }
}
