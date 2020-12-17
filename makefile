# Copyright (c) 2010-2020, Lawrence Livermore National Security, LLC. Produced
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
LIB_MFEM 			 = $(MFEM_BUILD_DIR)/libmfem.a
LIB_GLVIS_JS 	 = $(GLVIS_DIR)/libglvis.js

.PHONY: clean style versions libmfem libglvis

all: $(LIB_GLVIS_JS)

$(LIB_MFEM):
	# ranlib causes problems
	@$(MAKE) -C $(MFEM_DIR) CXX=$(EMCXX) MFEM_TIMER_TYPE=0 BUILD_DIR=$(MFEM_BUILD_DIR) serial \
		AR=$(EMAR) ARFLAGS=rcs RANLIB=echo

$(LIB_GLVIS_JS): $(LIB_MFEM)
	@$(MAKE) -C $(GLVIS_DIR) GLM_DIR=$(GLM_ROOT) MFEM_DIR=$(MFEM_BUILD_DIR) js

libmfem: $(LIB_MFEM)

libglvis: $(LIB_GLVIS_JS)

versions:
	@echo "emscripten: $(shell $(EMCXX) --version | head -n 1 | grep -o "[0-9]\+\.[0-9]\+\.[0-9]\+")"
	@echo "mfem:       $(shell cd $(MFEM_DIR) && git rev-parse HEAD)"
	@echo "glvis:      $(shell cd $(GLVIS_DIR) && git rev-parse HEAD)"

style:
	@which $(NPX) > /dev/null && $(NPX) prettier -w . || echo "fatal: $(NPX) isn't available, please install npm."

clean:
	@test -d $(MFEM_BUILD_DUR) && rm -rf $(MFEM_BUILD_DIR)
	@$(MAKE) -C $(GLVIS_DIR) clean
