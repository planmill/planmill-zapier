"use strict";

var Zap = {


/******************
Subscription functions
*******************/
   pre_subscribe: function(bundle) { //for subscribing PlanMill hooks
       
        bundle.request.data = JSON.stringify({
          'url': bundle.target_url, // special generated URL by zapier
          'hook': bundle.event // set in trigger definition
          });
        
        return {
          url: bundle.request.url,
          method: bundle.request.method,
          auth: bundle.request.auth,
          headers: bundle.request.headers,
          params: bundle.request.params,
          data: bundle.request.data
          };
       },
   
   post_subscribe: function(bundle) {
    // ** the idea here is to persist some data about the hook **
      var subscribe_data = JSON.parse(bundle.response.content);
      
 //REMOVE AFTER STATUS CODE FIXED (ONLY THIS SECTION)
        if (bundle.response.status_code === 400) { //temporary fix for PlanMill returning 400 status for expired tokens
          throw new RefreshTokenException(); // So we can refresh token
        }
        
      return subscribe_data; // should be JSON serializable!
      },
      
    pre_unsubscribe: function(bundle) {
    // ** the idea here is properly construct the hook removal request **
        bundle.request.url = bundle.request.url + '/' + bundle.subscribe_data.id;
        bundle.request.method = 'DELETE';
        return bundle.request;
  },

//REMOVE AFTER STATUS CODE FIXED

   post_unsubscribe: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },       

/******************
Polling functions - use primarily for filters
*******************/


//REMOVE AFTER STATUS CODE FIXED
   new_timereport_post_poll: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
  
 //REMOVE AFTER STATUS CODE FIXED
   get_projects_post_poll: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
  
//REMOVE AFTER STATUS CODE FIXED
    new_contact_post_poll: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
       
 
 //REMOVE AFTER STATUS CODE FIXED
   new_user_post_poll: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },


//REMOVE AFTER STATUS CODE FIXED
   me_post_poll: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },


/******************
Search functions
*******************/

 //REMOVE AFTER STATUS CODE FIXED
   find_account_post_search: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },

 //REMOVE AFTER STATUS CODE FIXED
   find_account_post_custom_search_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
       
 //REMOVE AFTER STATUS CODE FIXED
    find_project_post_search: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
       
//REMOVE AFTER STATUS CODE FIXED
   find_project_post_custom_search_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },

//REMOVE AFTER STATUS CODE FIXED
   find_user_post_search: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },


//REMOVE AFTER STATUS CODE FIXED
   find_user_post_custom_search_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
     

/******************
Action functions
*******************/

    create_timereport_pre_write: function(bundle) {
        var outbound = JSON.parse(bundle.request.data);
        outbound.start = formatLocalDate(outbound.start);
        if(outbound.person !== null){
           outbound.person = outbound.person;
        } else {
           outbound.person = bundle.auth_fields.username;
        }
        outbound.comment = outbound.comment.substring(0, 512);
        bundle.request.data = JSON.stringify(outbound);
        return bundle.request;       
    },

//REMOVE AFTER STATUS CODE FIXED
   create_timereport_post_write: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
    
    create_prospect_pre_write: function(bundle) {
        var outbound = bundle.request.data;
        var account = getResourceByName(bundle, 'accounts', outbound.account);
        if(account !== null){
           outbound.account = account[0].id;
           } else { 
           account = postNewProspectAccount(bundle, outbound.account, 9, 50);
           //WAITING for fix in Account location handling in PlanMill
           if (account.code !== null) {
               outbound.account = undefined;
               } else {
               outbound.account = account.id;
               }
         }     
        bundle.request.data = outbound;
        return bundle.request;       
    }, 

//REMOVE AFTER STATUS CODE FIXED
   create_prospect_post_write: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
    
//REMOVE AFTER STATUS CODE FIXED
   create_prospect_post_custom_action_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
       
//REMOVE AFTER STATUS CODE FIXED
  create_timereport_post_custom_action_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
    
/******************
Trigger functions
*******************/
    //after new timereport hook event has been caught, populate with user, project, task and whole timereport info
    new_timereport_catch_hook: function(bundle) {
        var timereporthook_data = bundle.cleaned_request;    
 
        var user_data = getResource(bundle, 'users', timereporthook_data.eventUser, null);
        timereporthook_data.eventUser = user_data.lastName + ', ' + user_data.firstName;
        
        //TODO: do this only if project is not empty
        var project_data = getResource(bundle, 'projects', timereporthook_data.eventProject, null);
        timereporthook_data.eventProject = project_data.name;

        var timereport_data = getResource(bundle, 'timereports', timereporthook_data.Id, null);
        
        //TODO: do this only if task is not empty
        var task_data = getResource(bundle, 'tasks', timereport_data.task, project_data.id);

        timereporthook_data.task = task_data.name;
        timereporthook_data.amount = timereport_data.amount/60;
        timereporthook_data.comment = timereport_data.comment;
        timereporthook_data.link = 'https://online.planmill.com/'+bundle.auth_fields.instance + '/index.jsp?category=TimeSheet.Timer.Single%20report%20no%20timer&noreturnlink=true&Id='+timereport_data.id;
 
        return timereporthook_data;
  },
  
//REMOVE AFTER STATUS CODE FIXED
  get_projects_post_custom_trigger_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },
    
   
//REMOVE AFTER STATUS CODE FIXED
  new_contact_post_custom_trigger_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  },


//REMOVE AFTER STATUS CODE FIXED
  new_user_post_custom_trigger_fields: function(bundle) { //temporary fix for PlanMill returning 400 status for expired tokens
        if (bundle.response.status_code === 400) {
          throw new RefreshTokenException(); // So we can refresh token
    }
    return JSON.parse(bundle.response.content);
  }

  
};

/*******-***********
Helper functions
*******************/

//use for fetching additional information like names from catch hook and post poll functions
function getResource(bundle, resource, id, project_id) {
    var request = {
          method: 'GET',
          url: 'https://online.planmill.com/'+bundle.auth_fields.instance+'/api/1.5/'+resource+'/' + id,
          params: {
              project: project_id
              }, 
          headers: {
            Accept: 'application/json'
            }, 
          auth: ['clientid', 'clientsecret','instance','access_token','refresh_token'], 
          data: null
          }; 
        var response = z.request(request);
        var data = JSON.parse(response.content);
    
    return data;
}

//use for fetching additional information like names from catch hook and post poll functions
function getResourceByName(bundle, resource, searchkey_data) {
    var request = {
          method: 'GET',
          url: 'https://online.planmill.com/'+bundle.auth_fields.instance+'/api/1.5/'+resource+'/',
          params: {
              searchkey: searchkey_data,
              rowcount: 1,
              order: 1,
              sort: 'id'
              }, 
          headers: {
            Accept: 'application/json'
            }, 
          auth: ['clientid', 'clientsecret','instance','access_token','refresh_token'], 
          data: null
          };
        var response = z.request(request);
        var data = JSON.parse(response.content);
    
    return data;
}

function postNewProspectAccount(bundle, account_name, account_type, account_owner) {
    var resource = 'accounts';
    var request = {
          method: 'POST',
          url: 'https://online.planmill.com/'+bundle.auth_fields.instance+'/api/1.5/'+resource+'/',
          headers: {
            Accept: 'application/json'
            }, 
          auth: ['clientid', 'clientsecret','instance','access_token','refresh_token'], 
          json: {
            "name": account_name,
            "type": account_type,
            "owner": account_owner
            }
          };
        var response = z.request(request);
        console.log(response);
        var data = JSON.parse(response.content);

    return data;
}


function formatLocalDate(mydate) {
    var now = new Date(mydate),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear() 
        + '-' + pad(now.getMonth()+1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours())
        + ':' + pad(now.getMinutes()) 
        + ':' + pad(now.getSeconds())
        + '.' + pad(now.getMilliseconds()) +'0'
        + dif + pad(tzo / 60) 
        + '' + pad(tzo % 60);
}
