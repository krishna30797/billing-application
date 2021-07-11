using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BillingApplication.Migrations
{
    public partial class productunits_added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    InvoiceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceDescription = table.Column<string>(nullable: true),
                    InvoiceDate = table.Column<DateTime>(nullable: false),
                    Total = table.Column<decimal>(nullable: false),
                    FreightCharges = table.Column<decimal>(nullable: false),
                    LoadingCharges = table.Column<decimal>(nullable: false),
                    NetTotal = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoice", x => x.InvoiceId);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductCode = table.Column<string>(nullable: true),
                    ProductDescription = table.Column<string>(nullable: true),
                    Price = table.Column<decimal>(nullable: false),
                    Units = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ProductInvoice",
                columns: table => new
                {
                    ProductInvoiceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceId = table.Column<int>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    Price = table.Column<decimal>(nullable: false),
                    Quantity = table.Column<decimal>(nullable: false),
                    Units = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductInvoice", x => x.ProductInvoiceId);
                    table.ForeignKey(
                        name: "FK_ProductInvoice_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductInvoice_InvoiceId",
                table: "ProductInvoice",
                column: "InvoiceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "ProductInvoice");

            migrationBuilder.DropTable(
                name: "Invoice");
        }
    }
}
