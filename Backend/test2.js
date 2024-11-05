import ibmdb from "ibm_db"; // Ensure ibmdb is imported
var connStr =
  "DRIVER={IBM INFORMIX ODBC DRIVER};SERVER=VWBBOSSDNV;DATABASE=denver;HOST=VWBBOSSDNV;SERVICE=svc_drda;PROTOCOL=drsoctcp;UID=webdev;PWD=informixwebdev;";

ibmdb.open(connStr, function (err, conn) {
  if (err) return console.log(err);

  conn.query("select * from clubconfig", function (err, data) {
    if (err) console.log(err);
    else console.log(data);

    conn.close(function () {
      console.log("done");
    });
  });
});
ibmdb.open(connStr).then(
  (conn) => {
    conn.query("select * from clubconfig").then(
      (data) => {
        console.log(data);
        conn.closeSync();
      },
      (err) => {
        console.log(err);
      }
    );
  },
  (err) => {
    console.log(err);
  }
);
