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
 * Privacy provider for local_flujos.
 *
 * Declara las tablas y campos personales (sesiones, transcripciones,
 * respuestas y resultados). Los flujos/etapas/campos NO se declaran: son
 * contenido autorado por administradores (Alicia), no datos de los
 * participantes.
 *
 * La exportacion real de datos (export_user_data) se completa en el Commit 6
 * de PLAN_FLUJOS.md, cuando exista el formato definitivo del informe.
 * El borrado (delete_data_for_user / delete_data_for_all_users_in_context) SI
 * esta implementado en este commit: reutiliza el borrado en cascada de
 * \local_flujos\local\session::delete(), ya necesario para el CRUD normal.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\privacy;

use core_privacy\local\metadata\collection;
use core_privacy\local\request\approved_contextlist;
use core_privacy\local\request\contextlist;

defined('MOODLE_INTERNAL') || die();

/**
 * Privacy provider implementation for local_flujos.
 *
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */
class provider implements
        \core_privacy\local\metadata\provider,
        \core_privacy\local\request\plugin\provider {

    /**
     * Declara los campos con datos personales que almacena el plugin.
     *
     * @param collection $collection Coleccion de metadata a completar.
     * @return collection
     */
    public static function get_metadata(collection $collection): collection {
        $collection->add_database_table(
            'local_flujos_session',
            [
                'flowid' => 'privacy:metadata:local_flujos_session:flowid',
                'userid' => 'privacy:metadata:local_flujos_session:userid',
                'status' => 'privacy:metadata:local_flujos_session:status',
                'currentstageid' => 'privacy:metadata:local_flujos_session:currentstageid',
                'consenttime' => 'privacy:metadata:local_flujos_session:consenttime',
                'consenttextversion' => 'privacy:metadata:local_flujos_session:consenttextversion',
                'timestarted' => 'privacy:metadata:local_flujos_session:timestarted',
                'timecompleted' => 'privacy:metadata:local_flujos_session:timecompleted',
                'timemodified' => 'privacy:metadata:local_flujos_session:timemodified',
            ],
            'privacy:metadata:local_flujos_session'
        );

        $collection->add_database_table(
            'local_flujos_message',
            [
                'sessionid' => 'privacy:metadata:local_flujos_message:sessionid',
                'stageid' => 'privacy:metadata:local_flujos_message:stageid',
                'role' => 'privacy:metadata:local_flujos_message:role',
                'content' => 'privacy:metadata:local_flujos_message:content',
                'timecreated' => 'privacy:metadata:local_flujos_message:timecreated',
            ],
            'privacy:metadata:local_flujos_message'
        );

        $collection->add_database_table(
            'local_flujos_answer',
            [
                'sessionid' => 'privacy:metadata:local_flujos_answer:sessionid',
                'fieldid' => 'privacy:metadata:local_flujos_answer:fieldid',
                'value' => 'privacy:metadata:local_flujos_answer:value',
                'timecreated' => 'privacy:metadata:local_flujos_answer:timecreated',
                'timemodified' => 'privacy:metadata:local_flujos_answer:timemodified',
            ],
            'privacy:metadata:local_flujos_answer'
        );

        $collection->add_database_table(
            'local_flujos_result',
            [
                'sessionid' => 'privacy:metadata:local_flujos_result:sessionid',
                'resulttype' => 'privacy:metadata:local_flujos_result:resulttype',
                'contentjson' => 'privacy:metadata:local_flujos_result:contentjson',
                'timecreated' => 'privacy:metadata:local_flujos_result:timecreated',
            ],
            'privacy:metadata:local_flujos_result'
        );

        return $collection;
    }

    /**
     * Obtiene la lista de contextos con datos personales de un usuario.
     *
     * Todo el plugin usa CONTEXT_SYSTEM (es un plugin local_, no ligado a
     * cursos), asi que basta comprobar si el usuario tiene alguna sesion.
     *
     * @param int $userid
     * @return contextlist
     */
    public static function get_contexts_for_userid(int $userid): contextlist {
        global $DB;

        $contextlist = new contextlist();
        if ($DB->record_exists('local_flujos_session', ['userid' => $userid])) {
            $contextlist->add_system_context();
        }

        return $contextlist;
    }

    /**
     * Exporta los datos personales de un usuario.
     *
     * PENDIENTE (Commit 6, PLAN_FLUJOS.md): formatear transcripciones,
     * respuestas y resultados via \core_privacy\local\request\writer, una vez
     * definido el formato del informe final. El metadata ya queda declarado
     * arriba; falta unicamente el formateo de salida.
     *
     * @param approved_contextlist $contextlist
     * @return void
     */
    public static function export_user_data(approved_contextlist $contextlist): void {
        // TODO Commit 6: implementar exportacion real de sesiones, mensajes,
        // respuestas y resultados del usuario.
    }

    /**
     * Borra los datos personales de TODOS los usuarios en un contexto.
     *
     * Al ser un plugin de contexto unico (CONTEXT_SYSTEM), esto borra todas
     * las sesiones (y, en cascada, mensajes/respuestas/resultados) de todos
     * los usuarios. Los flujos/etapas/campos NO se borran: son contenido
     * autorado por administradores, no datos personales de participantes.
     *
     * @param \context $context
     * @return void
     */
    public static function delete_data_for_all_users_in_context(\context $context): void {
        if ($context->contextlevel != CONTEXT_SYSTEM) {
            return;
        }

        global $DB;
        $sessionids = $DB->get_fieldset_select('local_flujos_session', 'id', '1 = 1');
        foreach ($sessionids as $sessionid) {
            \local_flujos\local\session::delete($sessionid);
        }
    }

    /**
     * Borra los datos personales de un usuario especifico.
     *
     * @param approved_contextlist $contextlist
     * @return void
     */
    public static function delete_data_for_user(approved_contextlist $contextlist): void {
        $hassystemcontext = false;
        foreach ($contextlist->get_contexts() as $context) {
            if ($context->contextlevel == CONTEXT_SYSTEM) {
                $hassystemcontext = true;
                break;
            }
        }
        if (!$hassystemcontext) {
            return;
        }

        global $DB;
        $userid = (int) $contextlist->get_user()->id;
        $sessionids = $DB->get_fieldset_select('local_flujos_session', 'id', 'userid = ?', [$userid]);
        foreach ($sessionids as $sessionid) {
            \local_flujos\local\session::delete($sessionid);
        }
    }
}
