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
 * Persistence for local_flujos_message.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\local;

defined('MOODLE_INTERNAL') || die();

/**
 * CRUD para la transcripcion de una sesion. Sin borrado individual: los
 * mensajes se borran en bloque como parte de session::delete().
 */
class message {

    /** @var string Nombre de la tabla. */
    const TABLE = 'local_flujos_message';

    /**
     * Agrega un mensaje a la transcripcion de una sesion.
     *
     * @param \stdClass $data Debe incluir sessionid, stageid, role, content.
     * @return int Id del mensaje creado.
     */
    public static function create(\stdClass $data): int {
        global $DB;

        $record = new \stdClass();
        $record->sessionid = $data->sessionid;
        $record->stageid = $data->stageid;
        $record->role = $data->role;
        $record->content = $data->content;
        $record->timecreated = time();

        return $DB->insert_record(self::TABLE, $record);
    }

    /**
     * Obtiene la transcripcion completa de una sesion en orden cronologico.
     *
     * @param int $sessionid
     * @return array
     */
    public static function get_by_session(int $sessionid): array {
        global $DB;
        return $DB->get_records(self::TABLE, ['sessionid' => $sessionid], 'timecreated ASC');
    }

    /**
     * Obtiene los mensajes de una sesion acotados a una etapa.
     *
     * @param int $sessionid
     * @param int $stageid
     * @return array
     */
    public static function get_by_session_and_stage(int $sessionid, int $stageid): array {
        global $DB;
        return $DB->get_records(self::TABLE, ['sessionid' => $sessionid, 'stageid' => $stageid], 'timecreated ASC');
    }
}
