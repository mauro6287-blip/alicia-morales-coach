<?php
// CLI idempotente para crear el curso piloto "Liderazgo – Piloto" (Hito 1).
// Se ejecuta desde entrypoint.sh como www-data. Si el curso ya existe, solo
// imprime su id. Imprime una línea PILOT_COURSE_ID=<n> para leer desde los logs.
// Ubicado fuera de /public (no accesible por web).

define('CLI_SCRIPT', true);

require(__DIR__ . '/../config.php');                 // /var/www/html/config.php
require_once($CFG->dirroot . '/course/lib.php');

$shortname = 'liderazgo-piloto';

$existing = $DB->get_record('course', ['shortname' => $shortname]);
if ($existing) {
    echo "PILOT_COURSE_ID={$existing->id} (ya existía)\n";
    exit(0);
}

// Categoría destino: la de menor id (Miscellaneous en una instalación fresca).
$cats = $DB->get_records('course_categories', null, 'id ASC', 'id', 0, 1);
$categoryid = $cats ? reset($cats)->id : 1;

$data = new stdClass();
$data->fullname      = 'Liderazgo – Piloto';
$data->shortname     = $shortname;
$data->category      = $categoryid;
$data->summary       = 'Curso piloto del Hito 1 (integración Moodle).';
$data->summaryformat = FORMAT_HTML;
$data->format        = 'topics';
$data->visible       = 1;

$course = create_course($data);
echo "PILOT_COURSE_ID={$course->id} (creado)\n";
