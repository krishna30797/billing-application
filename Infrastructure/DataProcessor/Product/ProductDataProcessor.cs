using BillingApplication.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Data
{
    public class ProductDataProcessor:IProductDataProcessor
    {
        private readonly ProductInventoryContext _context;

        public ProductDataProcessor(ProductInventoryContext context)
        {
            _context = context;
        }

        public List<Product> CreateProduct(Product product)
        {
            _context.Add(product);
            _context.SaveChanges();
            return _context.Product.ToList(); 
        }
        public List<Product> UpdateProduct(Product product)
        {
            _context.Update(product);
            _context.SaveChanges();
            return _context.Product.ToList(); 
        }
        public List<Product> DeleteProduct(int id)
        {
            var product = _context.Product.Find(id);
            _context.Product.Remove(product);
            _context.SaveChanges();
            return _context.Product.ToList();
        }
        public Product GetProductById(int id)
        {

            return  _context.Product.FirstOrDefault(m => m.id == id);
           
        }
        public List<Product> GetAllProducts()
        {
            var result = _context.Product.ToList();
            return result;
        }
        public List<Product> GetProductBySearch(string? searchParam)
        {

            var result = _context.Product.Where(p => p.ProductCode.Contains(searchParam) || p.ProductDescription.Contains(searchParam)).ToList();
            return result;
        }
    }
}
