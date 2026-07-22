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
 * Version information for local_flujos.
 *
 * Motor de flujos conversacionales guiados: experiencias por etapas donde la
 * IA conversa y evalúa, se capturan datos estructurados con consentimiento y
 * se entrega un resultado final. Ver PLAN_FLUJOS.md en la raíz del repo.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$plugin->component = 'local_flujos';
$plugin->version   = 2026072202;        // AAAAMMDDXX. Commit 2: modelo de datos.
$plugin->requires  = 2025041400;        // Moodle 5.0 o superior.
$plugin->supported = [502, 502];        // Probado en Moodle 5.2.
$plugin->maturity  = MATURITY_ALPHA;
$plugin->release   = '0.2.0';
