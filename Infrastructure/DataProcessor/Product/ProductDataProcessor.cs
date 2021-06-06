using BillingApplication.Model;
using Microsoft.EntityFrameworkCore;
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

                if (CheckDuplicateProductCode(product.ProductCode, product.id))
                {
                    _context.Add(product);
                    _context.SaveChanges();
                    return _context.Product.AsNoTracking().ToList();
                }
                else
                {
                    throw new Exception("Product Code Already Exists");
                }
            
        }
        public List<Product> UpdateProduct(Product product)
        {
                if (CheckDuplicateProductCode(product.ProductCode, product.id))
                {
                    _context.Update(product);
                    _context.SaveChanges();
                    return _context.Product.AsNoTracking().ToList();
                }
                else
                {
                    throw new Exception("Product Code Already Exists");
                }
        }
        public List<Product> DeleteProduct(int id)
        {
            var product = _context.Product.AsNoTracking().FirstOrDefault(i=>i.id==id);
            _context.Product.Remove(product);
            _context.SaveChanges();
            return _context.Product.AsNoTracking().ToList();
        }
        public Product GetProductById(int id)
        {

            return  _context.Product.AsNoTracking().FirstOrDefault(m => m.id == id);
           
        }
        public List<Product> GetAllProducts()
        {
            var result = _context.Product.AsNoTracking().ToList();
            return result;
        }
        public List<Product> GetProductBySearch(string? searchParam)
        {

            var result = _context.Product.AsNoTracking().Where(p => p.ProductCode.Contains(searchParam) || p.ProductDescription.Contains(searchParam)).ToList();
            return result;
        }
        private bool CheckDuplicateProductCode(string productCode,int id)
        {
            Product existingProduct= _context.Product.AsNoTracking().FirstOrDefault(p => p.ProductCode == productCode);
            return !(existingProduct != null && existingProduct.id != id) ;
        }
    }
}
