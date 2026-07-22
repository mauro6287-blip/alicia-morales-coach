<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Cadenas de idioma en español para local_flujos.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['pluginname'] = 'Flujos guiados';
$string['flujos:manage'] = 'Crear y editar flujos guiados';
$string['flujos:view'] = 'Ejecutar flujos guiados';
$string['flujos:viewresults'] = 'Ver resultados de flujos guiados de otros usuarios';

// Metadata de privacidad: local_flujos_session.
$string['privacy:metadata:local_flujos_session'] = 'Información sobre una ejecución de un flujo guiado por parte de un usuario.';
$string['privacy:metadata:local_flujos_session:flowid'] = 'El id del flujo que se está ejecutando.';
$string['privacy:metadata:local_flujos_session:userid'] = 'El id del usuario que ejecuta el flujo.';
$string['privacy:metadata:local_flujos_session:status'] = 'El estado de la ejecución: en curso, completada o abandonada.';
$string['privacy:metadata:local_flujos_session:currentstageid'] = 'El id de la etapa en la que se encuentra actualmente el usuario.';
$string['privacy:metadata:local_flujos_session:consenttime'] = 'La fecha en que el usuario dio su consentimiento para iniciar el flujo.';
$string['privacy:metadata:local_flujos_session:consenttextversion'] = 'La versión del texto de consentimiento que aceptó el usuario.';
$string['privacy:metadata:local_flujos_session:timestarted'] = 'La fecha en que el usuario inició el flujo.';
$string['privacy:metadata:local_flujos_session:timecompleted'] = 'La fecha en que el usuario completó el flujo.';
$string['privacy:metadata:local_flujos_session:timemodified'] = 'La fecha de la última actualización de la ejecución.';

// Metadata de privacidad: local_flujos_message.
$string['privacy:metadata:local_flujos_message'] = 'La transcripción de la conversación de una ejecución de un flujo guiado.';
$string['privacy:metadata:local_flujos_message:sessionid'] = 'El id de la ejecución a la que pertenece este mensaje.';
$string['privacy:metadata:local_flujos_message:stageid'] = 'El id de la etapa en que se envió este mensaje.';
$string['privacy:metadata:local_flujos_message:role'] = 'Quién envió el mensaje: el usuario, el asistente o el sistema.';
$string['privacy:metadata:local_flujos_message:content'] = 'El contenido de texto del mensaje.';
$string['privacy:metadata:local_flujos_message:timecreated'] = 'La fecha en que se envió el mensaje.';

// Metadata de privacidad: local_flujos_answer.
$string['privacy:metadata:local_flujos_answer'] = 'Los valores de datos estructurados capturados durante una ejecución de un flujo guiado.';
$string['privacy:metadata:local_flujos_answer:sessionid'] = 'El id de la ejecución a la que pertenece esta respuesta.';
$string['privacy:metadata:local_flujos_answer:fieldid'] = 'El id del campo para el que se capturó este valor.';
$string['privacy:metadata:local_flujos_answer:value'] = 'El valor capturado.';
$string['privacy:metadata:local_flujos_answer:timecreated'] = 'La fecha en que se capturó por primera vez el valor.';
$string['privacy:metadata:local_flujos_answer:timemodified'] = 'La fecha de la última actualización del valor.';

// Metadata de privacidad: local_flujos_result.
$string['privacy:metadata:local_flujos_result'] = 'El informe o plan de acción final generado para una ejecución completada.';
$string['privacy:metadata:local_flujos_result:sessionid'] = 'El id de la ejecución a la que pertenece este resultado.';
$string['privacy:metadata:local_flujos_result:resulttype'] = 'El tipo de resultado generado.';
$string['privacy:metadata:local_flujos_result:contentjson'] = 'El contenido generado del resultado.';
$string['privacy:metadata:local_flujos_result:timecreated'] = 'La fecha en que se generó el resultado.';
