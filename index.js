const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.type("json");

  const keluaran = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://nekopoi.help",
    data: {
      //Ambil_anime_terbaru: "/terbaru",
      Ambil_detail_anime: "/detail/:endpoint",
      //Ambil_stream_anime: "/stream/:endpoint",
      //Ambil_search_anime: "/search/:namaanime",
      //Ambil_all_kategori_list: "/genrelist",
      //Ambil_data_genre: "/genres/:endpoint",
    },
  };
  res.send(keluaran);
});

app.get("/detail/:nama", (req, res) => {
  const url = req.params.nama;

  getDetailAnime(url).then((result) => {
    res.send(result);
  });
});

async function getDetailAnime(url) {
  let { data } = await axios.get("https://nekopoi.help/anime/" + url);

  const $ = cheerio.load(data);

  let arr = [];
  let arr2 = [];

  const fotonime = $("div.bg-white.shadow").find(".postprocover img").attr("src");
  const judul = $("div.bg-white.shadow").find("div.colinfo h2").first().text();
  const sinopsis = $("div.jcontent.jayapanel").find(".sinops").text();

  $(".colinfo .episodelist ul li").each((index, element) => {
    const episod = $(element).find("a").text();
    let endpoint = $(element).find("a").attr("href");

    endpoint = endpoint.split("/")[4];

    arr2.push({
      id: index + 1,
      title: episod,
      endpoint: endpoint,
    });
  });

  arr.push({
    fotonime: fotonime,
    judul: judul,
    sinopsis: sinopsis,
  });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://nekopoi.help/",
    data: {
      arr,
    },
  };

  return objek;
};

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
