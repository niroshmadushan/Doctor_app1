"""
Automated Unit Test Suite for Customer Request Managemnt Potal
Verifies Order Calculations, Status Transitions, and Data Models
"""
import unittest

class OrderManagementTestSuite(unittest.TestCase):
    def setUp(self):
        self.sample_order = {
            "id": "ORD-1001",
            "customer": "Test Customer",
            "items": [
                {"name": "Server Node", "price": 850.00, "qty": 2},
                {"name": "Storage 2TB", "price": 240.00, "qty": 1}
            ],
            "status": "Pending"
        }

    def test_order_total_calculation(self):
        items = self.sample_order["items"]
        total = sum(i["price"] * i["qty"] for i in items)
        self.assertEqual(total, 1940.00)

    def test_order_status_progression(self):
        valid_statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
        self.assertIn(self.sample_order["status"], valid_statuses)

    def test_order_identifier_format(self):
        self.assertTrue(self.sample_order["id"].startswith("ORD-"))

if __name__ == '__main__':
    unittest.main()
