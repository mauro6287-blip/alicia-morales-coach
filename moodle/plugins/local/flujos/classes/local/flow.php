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
 * Persistence for local_flujos_flow.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\local;

defined('MOODLE_INTERNAL') || die();

/**
 * CRUD y borrado en cascada para flujos.
 */
class flow {

    /** @var string Nombre de la tabla. */
    const TABLE = 'local_flujos_flow';

    /**
     * Crea un flujo nuevo.
     *
     * @param \stdClass $data Debe incluir name, usermodified; opcionalmente
     *        intro, introformat, status, settingsjson.
     * @return int Id del flujo creado.
     */
    public static function create(\stdClass $data): int {
        global $DB;

        $record = new \stdClass();
        $record->name = $data->name;
        $record->intro = $data->intro ?? null;
        $record->introformat = $data->introformat ?? FORMAT_HTML;
        $record->status = $data->status ?? 'draft';
        $record->settingsjson = $data->settingsjson ?? null;
        $record->usermodified = $data->usermodified;
        $record->timecreated = time();
        $record->timemodified = $record->timecreated;

        return $DB->insert_record(self::TABLE, $record);
    }

    /**
     * Obtiene un flujo por id.
     *
     * @param int $id
     * @return \stdClass|false
     */
    public static function get(int $id) {
        global $DB;
        return $DB->get_record(self::TABLE, ['id' => $id]);
    }

    /**
     * Lista flujos, opcionalmente filtrados por estado.
     *
     * @param string|null $status
     * @return array
     */
    public static function get_all(?string $status = null): array {
        global $DB;
        if ($status !== null) {
            return $DB->get_records(self::TABLE, ['status' => $status], 'timecreated DESC');
        }
        return $DB->get_records(self::TABLE, null, 'timecreated DESC');
    }

    /**
     * Actualiza un flujo existente.
     *
     * @param \stdClass $data Debe incluir id.
     * @return bool
     */
    public static function update(\stdClass $data): bool {
        global $DB;
        $data->timemodified = time();
        return $DB->update_record(self::TABLE, $data);
    }

    /**
     * Borra un flujo y, en cascada a nivel de aplicacion, todas sus etapas,
     * campos y sesiones asociadas (y, dentro de cada sesion, sus mensajes,
     * respuestas y resultados).
     *
     * @param int $flowid
     * @return void
     */
    public static function delete(int $flowid): void {
        global $DB;

        // Etapas del flujo -> borrar sus campos (cascada de stage::delete).
        $stageids = $DB->get_fieldset_select('local_flujos_stage', 'id', 'flowid = ?', [$flowid]);
        foreach ($stageids as $stageid) {
            field::delete_by_stage($stageid);
        }

        // Sesiones del flujo -> borrar mensajes/respuestas/resultados (cascada de session::delete).
        $sessionids = $DB->get_fieldset_select('local_flujos_session', 'id', 'flowid = ?', [$flowid]);
        foreach ($sessionids as $sessionid) {
            session::delete($sessionid);
        }

        $DB->delete_records('local_flujos_stage', ['flowid' => $flowid]);
        $DB->delete_records(self::TABLE, ['id' => $flowid]);
    }
}
