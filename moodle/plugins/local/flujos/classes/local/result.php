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
 * Persistence for local_flujos_result.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\local;

defined('MOODLE_INTERNAL') || die();

/**
 * CRUD para el entregable final generado al completar una sesion.
 */
class result {

    /** @var string Nombre de la tabla. */
    const TABLE = 'local_flujos_result';

    /**
     * Registra el resultado final de una sesion.
     *
     * @param \stdClass $data Debe incluir sessionid, resulttype, contentjson.
     * @return int Id del resultado creado.
     */
    public static function create(\stdClass $data): int {
        global $DB;

        $record = new \stdClass();
        $record->sessionid = $data->sessionid;
        $record->resulttype = $data->resulttype;
        $record->contentjson = $data->contentjson;
        $record->timecreated = time();

        return $DB->insert_record(self::TABLE, $record);
    }

    /**
     * Obtiene los resultados generados para una sesion.
     *
     * @param int $sessionid
     * @return array
     */
    public static function get_by_session(int $sessionid): array {
        global $DB;
        return $DB->get_records(self::TABLE, ['sessionid' => $sessionid]);
    }
}
