<?php

require('php/Auth.php');
$auth = new Auth();
if($auth->check()) {

require('php/sql.php');

$areaInsert = "INSERT INTO `okart_areas` (
`name` ,
`fylke` ,
`kommune`
)
VALUES (
?, ?, ?);";

$sth = $dbh->prepare($areaInsert);
$arguments = array($_POST['areaname'], $_POST['areafylke'], $_POST['areasted']);
$sth->execute($arguments);
$areaId = $dbh->lastInsertId();

$zip = new ZipArchive;
if ($zip->open($_FILES["file"]["tmp_name"]) === TRUE) {
    $zip->extractTo('./tiles/'.$areaId.'/');
    $zip->close();
    header('Location: define-area.php#tileid-'.$areaId);
} else {
    
}
}
?> 