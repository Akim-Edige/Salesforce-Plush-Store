public with sharing class ProductController {

	public class Filters {
		@AuraEnabled
		public String keySearch { get; set; }
		@AuraEnabled
		public String[] checkedFamily { get; set; }
		@AuraEnabled
		public String[] checkedType { get; set; }
	}


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
