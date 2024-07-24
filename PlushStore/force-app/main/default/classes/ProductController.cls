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

//		String[] family, type, criteria = new List<String>{};

//		family = filters.checkedFamily;
//		type = filters.checkedType;
		String searchPattern = '%' + Key + '%';

		return [
				SELECT Name, Family__c, Type__c, Price__c, Description__c, Product_Image__c
				FROM Product__c
				WHERE (Name LIKE: searchPattern
				OR Description__c LIKE: searchPattern)
				AND (Family__c IN: family
				OR Type__c IN: type)
		];

//		if (!String.isEmpty(filters.keySearch)) {
//			key = '%' + filters.keySearch + '%';
//			criteria.add('Name LIKE :key');
//		}
//
//		if (!filters.checkedFamily.isEmpty() ) {
//			family = filters.checkedFamily;
//			criteria.add('Family__c IN :family');
//		}
//			if ( !filters.checkedType.isEmpty()) {
//				type = filters.checkedType;
//				criteria.add('Type__c IN :type');
//			}
//			if (criteria.size() > 0) {
//				whereClause = 'WHERE ' + String.join(criteria, ' AND ');
//			}
//
////		PagedResult result = new PagedResult();
////		result.totalItemCount = Database.countQuery(
////						'SELECT count() FROM Product__c ' + whereClause
////		);
//
//		return Database.query(
//						'SELECT Name, Family__c, Type__c, Price__c, Description__c, Product_Image__c FROM Product__c ' +
//						whereClause +
//						' WITH SECURITY_ENFORCED' +
//						' ORDER BY Name '
//		);
	}


//	@AuraEnabled(cacheable=true scope='global')
//	public static List<Product__c> getProductList(String Key){
//		String searchPattern = '%' + Key + '%';
//
//		return [
//				SELECT Name, Family__c, Type__c, Price__c, Description__c, Product_Image__c
//				FROM Product__c
//				WHERE Name LIKE: searchPattern
//		];
//	}
}