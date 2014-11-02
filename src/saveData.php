<?php
  $date = new DateTime();
  $dateString = date_timestamp_get($date);

$questions = array (
  "In your personal view, how important are cyber risks to the business?",
  "Does the main Board have a good understanding of what the company's key information and data assets are (e.g. intellectual property, financial, corporate/strategic information, customer/personal data, etc)?",
  "How has your company addressed Cyber Risks with its suppliers and other relevant third parties?",
  "Do you feel the company is doing enough to protect itself against cyber threats?",
  "Based on your own recollection, has the company suffered more or fewer cyber compromises and occurrences over the last year?"
);

$answersQ1 =  array (
  "Not at all important",
  "Of limited importance",
  "Extremely important",
  "I don't know"
);

$answersQ2 =  array (
  "A poor understanding",
  "Basic/acceptable",
  "A very clear understanding",
  "I don't know"
);

$answersQ3 =  array (
  "Contract Clauses",
  "Pre Contract Due Diligence",
  "Third Party Audit",
  "Third Party Self Assessments",
  "Other. Please specify...",
  "I don't know"
);

$answersQ4 =  array (
  "No, performance is quite unsatisfactory",
  "No, there is more we need to do",
  "Yes, we're doing good things",
  "Yes, standards are excellent",
  "I don't know"
);

$answersQ5 =  array (
  "Increase: significant",
  "Increase: slight",
  "Steady state/no change",
  "Decrease: slight",
  "Decrease: significant",
  "I don't know"
);

$questionBenchmark = $_POST['questionBenchmark'];
$answerQ1          = $_POST['answerQ1'];
$answerQ2          = $_POST['answerQ2'];
$answerQ3          = $_POST['answerQ3'];
$answerQ4          = $_POST['answerQ4'];
$answerQ5          = $_POST['answerQ5'];
$name              = $_POST['name'];
$company           = $_POST['company'];
$email             = $_POST['email'];
$subject           = $_POST['subject'];

$data = "Selected question : " . $questions[$questionBenchmark] . "\n\n"
        . $questions[0] . ":\n\t " . $answersQ1[$answerQ1 - 1] . "\n\n"
        . $questions[1] . ":\n\t " . $answersQ2[$answerQ2 - 1] . "\n\n"
        . $questions[2] . ":\n\t " . $answersQ3[$answerQ3 - 1] . "\n\n"
        . $questions[3] . ":\n\t " . $answersQ4[$answerQ4 - 1] . "\n\n"
        . $questions[4] . ":\n\t " . $answersQ5[$answerQ5 - 1] . "\n\n"
        . "Name: " . $name . "\n"
        . "Company: " . $company . "\n"
        . "Email: " . $email . "\n"
        . "Sector: " . $subject;

$f = fopen($_SERVER['DOCUMENT_ROOT'] . "/kpmg/FTSE350_v2/src/dataReceived_" . $dateString . ".txt","wb");
fwrite($f, $data);
fclose($f);

?>