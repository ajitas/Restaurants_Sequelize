// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {

    var userid;
    $("#add-user").hide();
    if($("#user-ddl").val() == "0"){
        $("#liked-restaurants").hide();
        $("#disliked-restaurants").hide();
        $("#add-restaurant").hide();
    }

    function getAllRestaurants(data){
        $("#unvisited-restaurants").empty();
        $("#unvisited-restaurants").append(`<h2>Wanna Try</h2>`);
        for(var i =0;i<data.restaurants.length;i++){
            if(!data.restaurants[i].visited){
                
                $("#unvisited-restaurants").append(`<br><div class="restaurant-each unvisited">
                <button class="btn liked" data-id=`+data.restaurants[i].id+`><i class="fa fa-thumbs-up"></i></button>`+
                data.restaurants[i].name+
                `<button class="btn disliked" data-id=`+data.restaurants[i].id+`><i class="fa fa-thumbs-down"></i></button>
                </div>`)
            }
        }

        $("#liked-restaurants").empty();
        $("#liked-restaurants").append(`<h1><i class="fa fa-thumbs-up"></i></h1>`);
        for(var i =0;i<data.restaurants.length;i++){
            if(data.restaurants[i].visited && data.restaurants[i].liked){
                
                $("#liked-restaurants").append(`<br>
                <div class="restaurant-each">`+data.restaurants[i].name+`<button class="btn delrestaurant" data-id=`+data.restaurants[i].id+`><i class="fa fa-trash"></i></button>
                </div>`)
            }
        }

        $("#disliked-restaurants").empty();
        $("#disliked-restaurants").append(`<h1><i class="fa fa-thumbs-down"></i></h1>`);
        for(var i =0;i<data.restaurants.length;i++){
            if(data.restaurants[i].visited && !data.restaurants[i].liked){
                
                $("#disliked-restaurants").append(`<br>
                <div class="restaurant-each">`+data.restaurants[i].name+`<button class="btn delrestaurant" data-id=`+data.restaurants[i].id+`><i class="fa fa-trash"></i></button>
                </div>`)
            }
        } 
    }
    $("#add-user-link").on("click", function(){
        $("#add-user").show();
        $("#liked-restaurants").hide();
        $("#disliked-restaurants").hide();
        $("#unvisited-restaurants").hide();
        $("#add-restaurant").hide();
        $("#user-ddl").val("0")
    })

    $("#user-ddl").on("change",function(){
        userid = $("#user-ddl").val();
        if(userid != "0"){
            $.get("/restaurants/"+userid, function(data){
                $("#liked-restaurants").show();
                $("#disliked-restaurants").show();
                $("#add-restaurant").show();
                $("#unvisited-restaurants").show();
                $("#add-user").hide();
                getAllRestaurants(data);
            });
        }
        else{
            $("#liked-restaurants").hide();
            $("#disliked-restaurants").hide();
            $("#add-restaurant").hide();
            window.location.href="/";
        }
    });

    //on click of like button send a PUT request
    $(document).on("click",".liked", function(event) {
        var id = $(this).data("id");

        //create object with new values
        var newRestaurantState = {
            visited: true,
            liked :true
        };

        // Send the PUT request with id in query parameter and values in request body
        $.ajax("/api/restaurants/" + id, {
            type: "PUT",
            data: newRestaurantState
        }).then(function() {
            $.get("/restaurants/"+userid, function(data){
                console.log(data)
                $("#liked-restaurants").show();
                $("#disliked-restaurants").show();
                getAllRestaurants(data);       
            });
        });
    });
  
    //on click of dislike button send a PUT request
    $(document).on("click",".disliked" ,function(event) {
        var id = $(this).data("id");

        //create object with new values
        var newRestaurantState = {
            visited: true,
            liked :false
        };

        // Send the PUT request with id in query parameter and values in request body
        $.ajax("/api/restaurants/" + id, {
            type: "PUT",
            data: newRestaurantState
        }).then(
            function() {
                $.get("/restaurants/"+userid, function(data){
                    console.log(data)
                    $("#liked-restaurants").show();
                    $("#disliked-restaurants").show();
                    getAllRestaurants(data);      
                });
            }
        );
    });


    //on click of delete button send a DELETE request
    $(document).on("click",".delrestaurant", function(){
      var id = $(this).data("id");
  
      // Send the DELETE request with id in query parameter
      $.ajax("/api/restaurants/"+id, {
        type: "DELETE"
      }).then(function() {
        $.get("/restaurants/"+userid, function(data){
            console.log(data)
            $("#liked-restaurants").show();
            $("#disliked-restaurants").show();
            getAllRestaurants(data);      
        });
      });
    });

    //on click of Add restuarant button send a POST request
    $("#submit-restaurant").on("click",function(event){
        event.preventDefault();

        var user = $("#user-ddl").val();
        var name = $("#restaurant-name").val().trim();
        $("#restaurant-name").val("")

        if(name !== ""){
            // Send the POST request with values in request body
            $.ajax("/api/restaurants", {
                type: "POST",
                data:{name:name,
                    userId:user}
            }).then(function() {
                $.get("/restaurants/"+userid, function(data){
                    console.log(data)
                    $("#liked-restaurants").show();
                    $("#disliked-restaurants").show();
                    getAllRestaurants(data);
                    
                });
            });
        }
    });

    $("#submit-user").on("click",function(event){
        event.preventDefault();

        var user = $("#user-name").val().trim();
        $("#user-name").val("")

        if(user !==""){

            // Send the POST request with values in request body
            $.ajax("/api/users", {
                type: "POST",
                data:{username:user}
            }).then(
                function() {
                location.reload();
            });
        }
    });
  });