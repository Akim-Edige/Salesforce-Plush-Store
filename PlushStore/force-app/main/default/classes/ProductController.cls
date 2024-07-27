public with sharing class ProductController {

	@AuraEnabled(Cacheable=true scope='global')
	public static List<Product__c> getProductList(String Key, String[] family, String[] type) {

		String searchPattern = '%' + Key + '%';

		return [
				SELECT Name, Family__c, Type__c, Price__c, Description__c, Product_Image__c
				FROM Product__c
				WHERE (Name LIKE: searchPattern
				OR Description__c LIKE: searchPattern)
				AND (Family__c IN: family
				OR Type__c IN: type)
		];

	}

	@AuraEnabled(Cacheable=true scope='global')
	public static List<OrderItem__c> getOrderItemList(String orderId, Integer count) {

		Integer zhai = count;
		return [
				SELECT Name, Family__c, Type__c, Price__c, Quantity__c, OrderId__c
				FROM OrderItem__c
				WHERE OrderId__c = :orderId
		];
	}


	@AuraEnabled(Cacheable=true scope='global')
	public static List<Order__c> getOrderInfo(String orderId, Integer count) {

		Integer zhai = count;
		return [
				SELECT Name, TotalPrice__c, TotalProductCount__c
				FROM Order__c
				WHERE Id = :orderId
				LIMIT 1
		];
	}

}