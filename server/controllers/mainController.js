exports.homepage = async (req, res) => {
  res.render("index", { title: "nodejs notes | Homepage",layout:'../views/layouts/front-page' });
};

exports.about = async (req,res)=>{
  res.render('about',{title:'nodejs notes | about'});
}