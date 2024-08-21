# Copyright (c) 2010-2021, Lawrence Livermore National Security, LLC. Produced
# at the Lawrence Livermore National Laboratory. All Rights reserved. See files
# LICENSE and NOTICE for details. LLNL-CODE-443271.
#
# This file is part of the GLVis visualization tool and library. For more
# information and source code availability see https://glvis.org.
#
# GLVis is free software; you can redistribute it and/or modify it under the
# terms of the BSD-3 license. We welcome feedback and contributions, see file
# CONTRIBUTING.md for details.

MFEM_DIR  ?= ../mfem
GLVIS_DIR ?= ../glvis
GLM_ROOT  ?= $(abspath ./glm)
EMCXX     ?= em++
EMAR      ?= emar
NPX       ?= npx

MFEM_BUILD_DIR = $(abspath ./build)
LIB_MFEM       = $(MFEM_BUILD_DIR)/libmfem.a
LIB_GLVIS_JS   = $(GLVIS_DIR)/lib/libglvis.js

.PHONY: clean style versions libmfem libglvis install

all: $(LIB_GLVIS_JS)

$(LIB_MFEM):
	# ranlib causes problems
	@$(MAKE) -C $(MFEM_DIR) CXX=$(EMCXX) MFEM_TIMER_TYPE=0 \
		BUILD_DIR=$(MFEM_BUILD_DIR) serial AR=$(EMAR) ARFLAGS=rcs RANLIB=echo

$(LIB_GLVIS_JS): $(LIB_MFEM)
	@$(MAKE) get_opensans
	@$(MAKE) -C $(GLVIS_DIR) GLM_DIR=$(GLM_ROOT) MFEM_DIR=$(MFEM_BUILD_DIR) \
		GLVIS_USE_LOGO=NO GLVIS_USE_LIBPNG=YES js

libmfem: $(LIB_MFEM)

libglvis: $(LIB_GLVIS_JS)

install: $(LIB_GLVIS_JS)
	@echo "Updating glvis.js"
	@$(MAKE) versions
	@cp $(LIB_GLVIS_JS) src/glvis.js

versions: em=$(shell $(EMCXX) --version | head -n 1 | grep -o "[0-9]\+\.[0-9]\+\.[0-9]\+")
versions: mfem=$(shell cd $(MFEM_DIR) && git describe --tag)
versions: glvis=$(shell cd $(GLVIS_DIR) && git describe --tag)
versions: js_target=src/versions.js
versions:
	@echo "Build Info:"
	@echo "emscripten: $(em)"
	@echo "mfem:       $(mfem)"
	@echo "glvis:      $(glvis)"
	@echo "updating $(js_target)"
	@echo "const versions = {\n  emscripten: \"$(em)\",\n  mfem: \"$(mfem)\",\n  glvis: \"$(glvis)\",\n};" > $(js_target)

style:
	@which $(NPX) > /dev/null && { $(NPX) prettier -w src/ live/ examples/ || exit 1; } \
		|| echo "fatal: $(NPX) isn't available, please install npm."

serve:
	python3 -m http.server 8000 --bind 0.0.0.0

servelocal:
	python3 -m http.server 8000 --bind 127.0.0.1

get_opensans:
	@if [ ! -f "$(GLVIS_DIR)/OpenSans.ttf" ]; then \
		curl -s "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" | \
		grep -o "https://fonts.gstatic.com/[^)]*" | \
		xargs -n 1 curl -s -o $(GLVIS_DIR)/OpenSans.ttf; \
		echo "Downloaded OpenSans.ttf to $(GLVIS_DIR)"; \
	else \
		echo "GLVis already has OpenSans.ttf. Skipping download."; \
	fi

realclean: clean
	@test -d $(MFEM_BUILD_DUR) && rm -rf $(MFEM_BUILD_DIR)

clean:
	@$(MAKE) -C $(GLVIS_DIR) clean
