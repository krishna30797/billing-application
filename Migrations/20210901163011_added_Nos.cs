using Microsoft.EntityFrameworkCore.Migrations;

namespace BillingApplication.Migrations
{
    public partial class added_Nos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Nos",
                table: "ProductInvoice",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nos",
                table: "ProductInvoice");
        }
    }
}
