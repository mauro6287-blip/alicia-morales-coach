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
 * English language strings for local_flujos.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['pluginname'] = 'Guided flows';
$string['flujos:manage'] = 'Create and edit guided flows';
$string['flujos:view'] = 'Run guided flows';
$string['flujos:viewresults'] = 'View guided flow results of other users';

// Privacy metadata: local_flujos_session.
$string['privacy:metadata:local_flujos_session'] = 'Information about a single run of a guided flow by a user.';
$string['privacy:metadata:local_flujos_session:flowid'] = 'The id of the flow being run.';
$string['privacy:metadata:local_flujos_session:userid'] = 'The id of the user running the flow.';
$string['privacy:metadata:local_flujos_session:status'] = 'The status of the run: in progress, completed, or abandoned.';
$string['privacy:metadata:local_flujos_session:currentstageid'] = 'The id of the stage the user is currently on.';
$string['privacy:metadata:local_flujos_session:consenttime'] = 'The time the user gave consent to start the flow.';
$string['privacy:metadata:local_flujos_session:consenttextversion'] = 'The version of the consent text the user accepted.';
$string['privacy:metadata:local_flujos_session:timestarted'] = 'The time the user started the flow.';
$string['privacy:metadata:local_flujos_session:timecompleted'] = 'The time the user completed the flow.';
$string['privacy:metadata:local_flujos_session:timemodified'] = 'The time the run was last updated.';

// Privacy metadata: local_flujos_message.
$string['privacy:metadata:local_flujos_message'] = 'The conversation transcript of a guided flow run.';
$string['privacy:metadata:local_flujos_message:sessionid'] = 'The id of the run this message belongs to.';
$string['privacy:metadata:local_flujos_message:stageid'] = 'The id of the stage this message was sent in.';
$string['privacy:metadata:local_flujos_message:role'] = 'Who sent the message: the user, the assistant, or the system.';
$string['privacy:metadata:local_flujos_message:content'] = 'The text content of the message.';
$string['privacy:metadata:local_flujos_message:timecreated'] = 'The time the message was sent.';

// Privacy metadata: local_flujos_answer.
$string['privacy:metadata:local_flujos_answer'] = 'The structured data values captured during a guided flow run.';
$string['privacy:metadata:local_flujos_answer:sessionid'] = 'The id of the run this answer belongs to.';
$string['privacy:metadata:local_flujos_answer:fieldid'] = 'The id of the field this value was captured for.';
$string['privacy:metadata:local_flujos_answer:value'] = 'The captured value.';
$string['privacy:metadata:local_flujos_answer:timecreated'] = 'The time the value was first captured.';
$string['privacy:metadata:local_flujos_answer:timemodified'] = 'The time the value was last updated.';

// Privacy metadata: local_flujos_result.
$string['privacy:metadata:local_flujos_result'] = 'The final report or action plan generated for a completed run.';
$string['privacy:metadata:local_flujos_result:sessionid'] = 'The id of the run this result belongs to.';
$string['privacy:metadata:local_flujos_result:resulttype'] = 'The type of result generated.';
$string['privacy:metadata:local_flujos_result:contentjson'] = 'The generated content of the result.';
$string['privacy:metadata:local_flujos_result:timecreated'] = 'The time the result was generated.';
