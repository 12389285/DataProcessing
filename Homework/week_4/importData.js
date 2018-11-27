function importData ()
{
  d3.json("data/results.json", function(data)
  {
    console.log(data);
  })
}
