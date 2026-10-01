package com.treino.api.treino.controller;

import com.treino.api.treino.dto.CreateDiaTreinoRequest;
import com.treino.api.treino.dto.DiaTreinoResponse;
import com.treino.api.treino.dto.UpdateDiaTreinoRequest;
import com.treino.api.treino.service.DiaTreinoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dias-treino")
public class DiaTreinoController {

    private final DiaTreinoService diaTreinoService;

    public DiaTreinoController(DiaTreinoService diaTreinoService) {
        this.diaTreinoService = diaTreinoService;
    }

    @GetMapping
    public List<DiaTreinoResponse> listarTodos() {
        return diaTreinoService.listarTodos();
    }

    @GetMapping("/{id}")
    public DiaTreinoResponse buscarPorId(@PathVariable Long id) {
        return diaTreinoService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<DiaTreinoResponse> criar(@RequestBody @Valid CreateDiaTreinoRequest request) {
        DiaTreinoResponse response = diaTreinoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public DiaTreinoResponse atualizar(
        @PathVariable Long id,
        @RequestBody 
        @Valid UpdateDiaTreinoRequest request) {
        return diaTreinoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        diaTreinoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
