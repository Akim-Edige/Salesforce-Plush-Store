public class CreateController {

	@AuraEnabled(Cacheable=false)
	public static String createProduct(String name, String price, String description, String family, String type, String image) {

		Product__c prod = new Product__c();
		prod.Name = name;
		prod.Price__c = Integer.valueof(price);
		prod.Family__c = family;
		prod.Type__c = type;
		prod.Description__c = description;
		prod.Product_Image__c = image;

		insert prod;
		return prod.Id;
	}

	@AuraEnabled(Cacheable=false)
	public static String createOrder() {

		Order__c order = new Order__c();

		order.TotalPrice__c = 0;
		order.TotalProductCount__c = 0;


		insert order;
		return order.Id;
	}

	@AuraEnabled(Cacheable=false)
	public static String createOrderItem(String name, String orderId, String price, String productId, Integer quantity, String family, String type) {

		OrderItem__c item = new OrderItem__c();
		item.Name = name;
		item.OrderId__c = orderId;
		item.Price__c = Integer.valueof(price);
		item.ProductId__c = productId;
		item.Quantity__c = quantity;
		item.Family__c = family;
		item.Type__c = type;

		insert item;
		return item.Id;
	}

}

