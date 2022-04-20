/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const ExtensionUtils = imports.misc.extensionUtils;


class WindowSwapperExtension {
    constructor() {
        this.settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.window-swapper");
    }


    enable() {
        window.console.log('enabling');
        Main.wm.addKeybinding(
            "swap-windows-left", this.settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this.swap(Meta.DisplayDirection.LEFT)
        );

        Main.wm.addKeybinding(
            "swap-windows-right", this.settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this.swap(Meta.DisplayDirection.RIGHT)
        );

        Main.wm.addKeybinding(
            "swap-windows-up", this.settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this.swap(Meta.DisplayDirection.UP)
        );

        Main.wm.addKeybinding(
            "swap-windows-down", this.settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this.swap(Meta.DisplayDirection.DOWN)
        );
        window.console.log('enabled');
    }

    disable() {
        window.console.log('disabling');
        Main.wm.removeKeybinding("swap-windows-left");
        Main.wm.removeKeybinding("swap-windows-right");
        Main.wm.removeKeybinding("swap-windows-up");
        Main.wm.removeKeybinding("swap-windows-down");
        window.console.log('disabled');
    }

    swap(to_direction) {
        window.console.log("swapping to " + to_direction);

        const cur_window = global.display.focus_window;
        const cur_workspace = global.workspaceManager.get_active_workspace();

        if (!cur_window || !cur_workspace) {
            window.console.log("No active window, can not swap");
            return;
        }

        const cur_monitor_index = cur_window.get_monitor();
        const target_monitor_index = global.display.get_monitor_neighbor_index(cur_monitor_index, to_direction);

        if (target_monitor_index < 0) {
            window.console.log("No target monitor, aborting");
            return;
        }

        if (target_monitor_index == cur_monitor_index) {
            window.console.log("Nothing to do");
            return;
        }

        const windows = cur_workspace.list_windows();

        const windows_on_cur_monitor = windows.filter(wnd => wnd.get_monitor() == cur_monitor_index);
        const windows_on_target_monitor = windows.filter(wnd => wnd.get_monitor() == target_monitor_index);

        windows_on_cur_monitor.forEach(wnd => wnd.move_to_monitor(target_monitor_index));
        windows_on_target_monitor.forEach(wnd => wnd.move_to_monitor(cur_monitor_index));
    }
}

function init() {
    return new WindowSwapperExtension();
}
