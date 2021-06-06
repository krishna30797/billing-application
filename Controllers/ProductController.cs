using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BillingApplication.Model;
using BillingApplication.Data;
using System.Net.Http;
using System.Net;

namespace BillingApplication.Controllers
{
    public class ProductController : ControllerBase
    {
        private readonly ProductInventoryContext _context;
        private readonly IProductDataProcessor _productDataProcessor;
        public ProductController(ProductInventoryContext context, IProductDataProcessor productDataProcessor)
        {
            _context = context;
            _productDataProcessor = productDataProcessor;
        }

        // GET: Product
        public IActionResult GetAllProducts()
        {
            try
            {
                return Ok(_productDataProcessor.GetAllProducts());
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        // GET: Product
        public List<Product> GetProductBySearch(string? searchParam)
        {

            var result = _productDataProcessor.GetProductBySearch(searchParam);
            return result;
        }
        // GET: Product/Details/5
        public Product GetProductById(int id)
        {

            try
            {

                var product = _productDataProcessor.GetProductById(id);

                return product;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        [HttpPost]

        public IActionResult Create([FromBody] Product product)
        {
            try
            {
                List<Product> allProduct = new List<Product>();
                if (ModelState.IsValid)
                {
                    allProduct = _productDataProcessor.CreateProduct(product);
                }
                return Ok(allProduct);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Edit([FromBody] Product product)
        {
            try
            {
                List<Product> allProduct = new List<Product>();

                if (ModelState.IsValid)
                {
                    return Ok(_productDataProcessor.UpdateProduct(product));
                }
                return Ok(allProduct);
            }

            catch (Exception ex)
            {
                return Ok(ex.Message);
            }

        }
        // POST: Product/Delete/5
        [HttpPost, ActionName("Delete")]
        public List<Product> Delete(int id)
        {
            var result = _productDataProcessor.DeleteProduct(id);
            return result;
        }

        private bool ProductExists(int id)
        {
            return _context.Product.Any(e => e.id == id);
        }
    }
}
