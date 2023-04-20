const Note = require("../models/Note");
const mongoose = require("mongoose");


// render all available notes in the db on the dashboard page
exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  try {
    Note.aggregate([
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          title: {
            $substr: ["$title", 0, 30],
          },
          body: {
            $substr: ["$body", 0, 100],
          },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec()
      .then((notes) => {
        Note.count()
          .exec()
          .then((count) => {
            res.render("dashboard/index", {
              username: req.user.firstName,
              title: "notes | dashboard",
              notes,
              layout: "../views/layouts/dashboard",
              current: page,
              pages: Math.ceil(count / perPage),
            });
          })
          .catch((err) => {
            next(err);
          });
      });
    // const notes = await Note.find({});
  } catch (error) {
    console.log(error);
  }
};

// view note by id
exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();
  console.log(note);

  if (note) {
    res.render("dashboard/view-note", {
      noteId: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong!");
  }
}; 

//update note by id
exports.dashboardUpdateNote = async (req, res) => {
  try{
      await Note.findOneAndUpdate({_id:req.params.id},{title:req.body.title,body:req.body.body,updatedAt:Date.now()}).where({user:req.user.id});
      res.redirect("/dashboard");
  }catch(error){
    console.log(error)
  }
};

//delete Note by id
exports.dashboardDeleteNote = async (req,res)=>{
  try {
    await Note.deleteOne({_id:req.params.id}).where({user:req.user.id});
    res.redirect("/dashboard")
  } catch (error) {
   console.log(error) 
  }
}


//add note rendering page
exports.dashboardAddNote = async (req,res)=>{
  try {
    res.render("dashboard/add",{
      layout:'../views/layouts/dashboard',
      title:'Add Note'
    });
  } catch (error) {
   console.log(error) 
  }
}


//adding notes when form is submitted
exports.dashboardAddNoteSubmit = async (req,res)=>{
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error)
  }
}



exports.dashboardSearch = async (req,res)=>{
  try {
    res.render('dashboard/search',{
      searchResults:'',
      layout:'../views/layouts/dashboard'
    });
  } catch (error) {
    console.log(error)
  }
}


exports.dashboardSearchSubmit = async (req,res)=>{
  
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSoecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g,'');
    const searchResults  = await Note.find({
      $or:[
        {title:{$regex:new RegExp(searchNoSoecialChars,'i')}},
        {body:{$regex:new RegExp(searchNoSoecialChars,'i')}}
      ]
    }).where({user:req.user.id});
    res.render('dashboard/search',{
      title:'search | dashboard',
      searchResults,
      layout:'../views/layouts/dashboard'
    })
  } catch (error) {
    console.log(error)
  }
}