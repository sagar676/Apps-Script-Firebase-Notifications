var firebaseURL = "https://gaspush.firebaseio.com/";
var UID = Session.getActiveUser().getEmail().replace(/[|&;$%@"<>()+,\.]/g, "");
var curUser = Plus.People.get('me');



function doGet() {
  return HtmlService.createHtmlOutputFromFile('index').setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function sendTestMessage(){
  sendNotificationToUser("seastonccsknightsorg",new Date());
}

function sendNotificationToUser(UID,message){
     var fb = FirebaseApp.getDatabaseByUrl(firebaseURL, PropertiesService.getScriptProperties().getProperty("secret"));
     fb.pushData("/users/"+UID+"/notifications", {"notification":message,"status":"unviewed"});
  
}


function registerClient(auth){
  var fb = FirebaseApp.getDatabaseByUrl(firebaseURL, PropertiesService.getScriptProperties().getProperty("secret"));
  var curUser = fb.getData("/users/"+UID);
  if(curUser){
    fb.updateData("/users/"+UID, auth);
  }else{
    fb.setData("/users/"+UID, auth);
  }
  return UID;
}
  

function makeToken(){
  if(!curUser.displayName){
    curUser.displayName = curUser.emails[0].value;
  }
  var tokenData = {"image": curUser.image.url,
                   "displayName": curUser.displayName
                   };
  
  
  var tokenGenerator = new FirebaseApp.getDatabaseByUrl(firebaseURL, PropertiesService.getScriptProperties().getProperty("secret"));
  var token = tokenGenerator.createAuthToken(Session.getActiveUser().getEmail(), tokenData);
  return token;
}


function getOnlineUsersV1(){
  var onlineUsers = [];
  var fb = FirebaseApp.getDatabaseByUrl(firebaseURL, PropertiesService.getScriptProperties().getProperty("secret"));   
  var res = fb.getData("/users");
  for(u in res){
    if(res[u].connections != undefined)
      onlineUsers.push(u);
  }   
  Logger.log(onlineUsers)
  return onlineUsers;
  
}

function getOnlineUsers(){
   var fb = FirebaseApp.getDatabaseByUrl(firebaseURL, PropertiesService.getScriptProperties().getProperty("secret"));   
  var res = fb.getData("/online");
  Logger.log(res)
  return res;
}

