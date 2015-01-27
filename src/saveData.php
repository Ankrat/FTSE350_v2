<?php
  $date = new DateTime();
  $dateString = date_timestamp_get($date);
  $host  = $_SERVER['HTTP_HOST'];
  $extra = 'benchmark.html';

  $data = $_POST['data'];
  if (json_decode($data) != null) { /* sanity check */
    $f = fopen($_SERVER['DOCUMENT_ROOT'] . "/export/dataReceived_" . $dateString . ".json","w+");
    fwrite($f, $data);
    fclose($f);
    echo json_encode(array('returned_val' => 'send'));
    // header("Location: http://$host/$extra");
  }else{
    //handle error
    echo json_encode(array('returned_val' => 'not send'));
  }
  exit();

?>