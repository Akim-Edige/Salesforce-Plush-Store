public class UserInfoController {
	@AuraEnabled(cacheable=true)
	public static Boolean getIsManager() {
		Id currentUserId = UserInfo.getUserId();
		User currentUser = [SELECT IsManager__c FROM User WHERE Id = :currentUserId LIMIT 1];
		return currentUser.IsManager__c;
	}
}
