INSTALL_DIR=~/.local/share/gnome-shell/extensions
SRC_DIR=window-swapper@kassick.net
LOCALE_SRC=$(shell find $(SRC_DIR) -regextype posix-extended -regex '.*\.(js|glade)' 2> /dev/null)
LOCALE_DIR=$(SRC_DIR)/locale
POT_FILE=$(SRC_DIR)/window-swapper.pot
PO_FILES=$(wildcard $(LOCALE_DIR)/*/LC_MESSAGES/*.po)
MO_FILES=$(PO_FILES:.po=.mo)

.PHONY: all
all: install

.PHONY: build
$(SRC_DIR)/schemas/gschema.compiled: $(SRC_DIR)/schemas/*.xml
	glib-compile-schemas $(SRC_DIR)/schemas

.PHONY: potfile
potfile:
	make $(POT_FILE)

.PHONY: mergepo
mergepo: $(POT_FILE)
	@for po in $(PO_FILES); \
	do \
		msgmerge --add-location --backup=none --sort-output --update $${po} $(POT_FILE); \
	done;

$(POT_FILE): $(LOCALE_SRC)
	@xgettext \
	--add-comments='Translators:' \
	--add-location \
	--from-code=utf-8 \
	--keyword \
	--keyword=_ \
	--keyword=D_:2 \
	--keyword=DC_:2 \
	--keyword=DN_:2,3 \
	--keyword=DP_:2c,3 \
	--keyword=N_:1,2 \
	--keyword=P_:1c,2 \
	--output=$@ \
	--package-name=sound-output-device-chooser \
	--sort-output \
	$^

$(LOCALE_DIR)/%/LC_MESSAGES/window-swapper.mo: $(LOCALE_DIR)/%/LC_MESSAGES/window-swapper.po
	msgfmt --check --output-file=$@ $<

.PHONY: install
install: $(SRC_DIR)/schemas/gschema.compiled
	@echo "Installing extension files in $(INSTALL_DIR)/window-swapper@kassick.net"
	mkdir -p $(INSTALL_DIR)
	cp -r "window-swapper@kassick.net"  $(INSTALL_DIR)
