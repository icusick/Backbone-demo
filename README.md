# Backbone-demo

* [Slideshow](https://docs.google.com/presentation/d/1T5q3-67-gFvPoCzR0-ONnck-Mh95Dhx5IOpGIghytPQ/edit?usp=sharing)

Backbone is a javascript library that uses models, collections and views to manipulate data. 
-framework not library
-you can think of it as sort of like Angular but with important differences. first of all angular is a framework, backbone is a library. 
-angular uses a model-view-controller arcitecture with two-way data binding. backbone uses a model-controller-presenter architecture 
-backbone uses underscore as a dependency for templating
-backbone doesn't have two-way data binding which means that you need to write that code yourself  


first of all, what is a model? it's our data. here's an example: 


var Dog = Backbone.Model.extend({
		defaults: function() {
			return {
			name: " ", 
			breed: " "
		}
	}
})

to instantiate an instance of a Dog:
var dog1 = new Dog ({name: "Poppy", breed: "dachshundt"})

if you were getting the information from a form:
var dog2 = new Dog ({name: $('#name').val(), breed: $('#breed').val()}) 


each dog is a model and if there are many dogs, they go into a Collection

var DogCollection = Backbone.Collection.extend({
	(here we tell it what it is going to be a collection of. it's going to be a collection of models of the kind Dog.)
	model: Dog
})

var dogs = new DogCollection()

let's add Poppy to our dog collection:
dogs.add(dog1). that's all! where do we write all this dog-spawning logic? in our dog VIEWS. we'll have one view for the dog model, and one for the dog collection 

let's talk more about views: 
-a view in backbone does what a controller does in an MVC framework.  
-they handle user events (clicks, for example), render html views and templates
-interacts with the data from the model
what's in a view? 
-each view is associated with an html element which you define at the beginning 
-tagName: "li"
-initializer function
	initialize: binds your view's render function (which will come up momentarily) to the model's "change" event so anywhere that the model data is displayed on the UI it is always immediately up to date. how do we explain this as being different from angular's two-way data binding? it seems like it DOES the same thing it's just that we have to write more code to get it to work. 
  example: 
  initialize: function(){
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },
-events:
	example:
	events: {
	    'click #show-edit': 'edit',
	    'click #delete': 'delete',
	    'click #update': 'update'
  	},

 -template: this grabs the stuff from your html page 
 	example: 
 	 template: $("#message-template").html(),
  	editTemplate: $("#edit-form").html(),

  -render function:
  	-not positive what this does generally. it looks like ours allows us to use mustache to print our model attributes onto the page
  	-creates the html which later gets appended -set all your text to what it's supposed to be so that we can append you later

  -edit: this function creates html for an edit form and pops it onto the page when "edit" button is clicked

  -update: (goes hand in hand with the edit function. it's what actually does the saving of the data)
  	it grabs the values from the forms
  	matches them up with their corresponding attributes
  	example:
  	var nameUpdate = $("[name='edit-name']").val();
    var breedUpdate = $("[name='edit-breed']").val();
    this.model.set({name: nameUpdate, breed: breedUpdate});
    this.model.save();

  -delete: calls a destroy event on the model

  all of this stuff goes into the DogView because as you saw, we only updated and deleted which is an action you perform on individual dogs. if you wanted to add an entire dog to the collection, you would want to work in your DogCollectionView
  -initialize: (is it weird that we don't have a change event?) 
  	-in this initializer we're telling the collection that we're going to be adding a dog and that it should look out for the addDog function

the createDog function actually makes a new Dog: grabs the info from the form, saves the info to a model, adds the model to the collection. the addDog function renders that new dog onto the page. we're not absolutely positive why these two functions need to 

render: loads the template into the view's "el" property 

the CollectionView and the FormView are both looking at the same data but in backbone we like to separate out our logic as much as possible. the new dog is created in the form and so that logic, the createDog function, is stored in the FormView, even though what is's doing is adding a new Dog (model) to the collection




