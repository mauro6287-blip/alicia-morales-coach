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
 * Persistence for local_flujos_answer.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\local;

defined('MOODLE_INTERNAL') || die();

/**
 * CRUD para los valores capturados de los campos estructurados. Un valor por
 * campo por sesion (indice unico sessionid+fieldid); set() hace upsert.
 */
class answer {

    /** @var string Nombre de la tabla. */
    const TABLE = 'local_flujos_answer';

    /**
     * Crea o actualiza el valor de un campo para una sesion (upsert).
     *
     * @param int $sessionid
     * @param int $fieldid
     * @param string $value
     * @return int Id del registro (nuevo o existente).
     */
    public static function set(int $sessionid, int $fieldid, string $value): int {
        global $DB;

        $existing = $DB->get_record(self::TABLE, ['sessionid' => $sessionid, 'fieldid' => $fieldid]);
        if ($existing) {
            $existing->value = $value;
            $existing->timemodified = time();
            $DB->update_record(self::TABLE, $existing);
            return $existing->id;
        }

        $record = new \stdClass();
        $record->sessionid = $sessionid;
        $record->fieldid = $fieldid;
        $record->value = $value;
        $record->timecreated = time();
        $record->timemodified = $record->timecreated;

        return $DB->insert_record(self::TABLE, $record);
    }

    /**
     * Obtiene todas las respuestas capturadas de una sesion.
     *
     * @param int $sessionid
     * @return array
     */
    public static function get_by_session(int $sessionid): array {
        global $DB;
        return $DB->get_records(self::TABLE, ['sessionid' => $sessionid]);
    }
}
