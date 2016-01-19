console.log("linked")

var Dog = Backbone.Model.extend({
  urlRoot: "/dogs"
})

var DogCollection = Backbone.Collection.extend({
  url: '/dogs',

  model: Dog
})

var DogView = Backbone.View.extend({
  tagName: "li",
  //our dog views listen for two events on their models
  //if a model 'changes', the view is re rendered
  //if a model 'destroys', the view is removed
  initialize: function(){
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  events: {
    'click #show-edit': 'edit',
    'click #delete': 'delete',
    'click #update': 'update'
  },

  template: $("#message-template").html(),
  editTemplate: $("#edit-form").html(),
  render: function(){
    var renderedDog = Mustache.render(this.template, this.model.attributes)
    this.$el.html(renderedDog)
    //we don't actually need to return the object for this app, but this is a common pattern you will see
    return this
  },

  edit: function(){
    //this function simply pops up an edit form by creating html and appending it to the view
    var template = this.editTemplate
    var html = Mustache.render(template, this.model.attributes)
    this.$el.append(html)
  },

  update: function(){
    //this function concerns the database. takes input, sets the model, and saves it
    //this function isn't ideal, because it allows a user to reset the model with empty attributes
    var nameUpdate = $("[name='edit-name']").val();
    var breedUpdate = $("[name='edit-breed']").val();
    this.model.set({name: nameUpdate, breed: breedUpdate});
    this.model.save();
    //this simply resets the input values to be empty after the model is updated
    nameUpdate.val("");
    breedUpdate.val("");
  },

  delete: function(){
    //calls a destroy event on the model
    this.model.destroy()
  }
})

var DogShow = Backbone.View.extend({

})

var DogCollectionView = Backbone.View.extend({
  initialize: function(){
    //set behavior that fires on the creation of every instance
    //listen to my collection i'm observing, if somethings added, do something
    this.listenTo(this.collection, 'add', this.addDog);
  },

  addDog: function(modelFromCollection){
    var newDogView = new DogView({model: modelFromCollection});
    newDogView.render();
    this.$el.append(newDogView.$el)
  }
})

var FormView = Backbone.View.extend({

  initialize: function(options){
    this.dogCollection = options.collection 
  },

  events: {
    'submit': 'createDog'
  },

  createDog: function(event){
    event.preventDefault()
    var name = $("[name='name']").val();
    var breed = $("[name='breed']").val();


    var newModel = new Dog({name: name, breed: breed})
    this.dogCollection.create(newModel)
    $("[name='name']").val("");
    $("[name='breed']").val("");
  }
})

var Router = Backbone.Router.extend({

  routes: {
    '': 'index',
    'dogs/:id': 'show'
  },

  index: function(){
    var dogCollection = new DogCollection()
    //when we create these views, we pass in a 'live' piece of the DOM as the top level el.
    var dogCollectionView = new DogCollectionView({collection: dogCollection, el: $("ul")})
    var formView = new FormView({el: $("form"), collection: dogCollection})
    dogCollection.fetch()
  },

  show: function(id){
    console.log("show route coming")
  }

})

var myRouter = new Router()
Backbone.history.start()
