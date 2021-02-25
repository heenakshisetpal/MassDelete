public with sharing class ListView {
    @AuraEnabled(cacheable=true)
    public static List<project__c> getProjectList() {
        return [SELECT  Project_name__c,Project_type__c, status__c,owner__c,Priority__c,End_date__c,description__c FROM project__c ];
    }
    @AuraEnabled
    public static void deleteprojects(list<Id> lstConIds){
        try {
            list<project__c> lstConsToDelete = new list<project__c>();
            System.debug('lstConIds ====> '+lstConIds);
            for(Id idCon : lstConIds) {
                lstConsToDelete.add(new project__c(Id = idCon));
            }
            if(!lstConsToDelete.isEmpty()) {
                delete lstConsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}
