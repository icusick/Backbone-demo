console.log("linked")

var Post = Backbone.Model.extend({
  urlRoot: "/posts"
})

var PostCollection = Backbone.Collection.extend({
  url: '/posts',

  model: Post
})

var PostView = Backbone.View.extend({
  tagName: "li",
  //our post views listen for two events on their models
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
    var renderedPost = Mustache.render(this.template, this.model.attributes)
    this.$el.html(renderedPost)
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

var PostShow = Backbone.View.extend({

})

var PostCollectionView = Backbone.View.extend({
  initialize: function(){
    //set behavior that fires on the creation of every instance
    //listen to my collection i'm observing, if somethings added, do something
    this.listenTo(this.collection, 'add', this.addPost);
  },

  addPost: function(modelFromCollection){
    var newPostView = new PostView({model: modelFromCollection});
    newPostView.render();
    this.$el.append(newPostView.$el)
  }
})

var FormView = Backbone.View.extend({

  initialize: function(options){
    this.postCollection = options.collection 
  },

  events: {
    'submit': 'createPost'
  },

  createPost: function(event){
    event.preventDefault()
    var name = $("[name='name']").val();
    var breed = $("[name='breed']").val();


    var newModel = new Post({name: name, breed: breed})
    this.postCollection.create(newModel)
    $("[name='name']").val("");
    $("[name='breed']").val("");
  }
})

var Router = Backbone.Router.extend({

  routes: {
    '': 'index',
    'posts/:id': 'show'
  },

  index: function(){
    var postCollection = new PostCollection()
    //when we create these views, we pass in a 'live' piece of the DOM as the top level el.
    var postCollectionView = new PostCollectionView({collection: postCollection, el: $("ul")})
    var formView = new FormView({el: $("form"), collection: postCollection})
    postCollection.fetch()
  },

  show: function(id){
    console.log("show route coming")
  }

})

var myRouter = new Router()
Backbone.history.start()
