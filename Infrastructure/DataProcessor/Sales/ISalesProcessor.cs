using BillingApplication.APIModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Data
{
    public interface ISalesProcessor
    {
        List<Sales> GetSalesByDate(DateTime fromDate, DateTime toDate);
    }
}
