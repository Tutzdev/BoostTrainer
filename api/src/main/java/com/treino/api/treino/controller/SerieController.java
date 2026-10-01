package com.treino.api.treino.controller;

import com.treino.api.treino.dto.CreateSerieRequest;
import com.treino.api.treino.dto.SerieResponse;
import com.treino.api.treino.dto.UpdateSerieRequest;
import com.treino.api.treino.service.SerieService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SerieController {

    private final SerieService serieService;

    public SerieController(SerieService serieService) {
        this.serieService = serieService;
    }

    @PostMapping("/api/exercicios/{exercicioId}/series")
    public ResponseEntity<SerieResponse> adicionar(
        @PathVariable Long exercicioId,
        @RequestBody 
        @Valid CreateSerieRequest request) {
        SerieResponse response = serieService.adicionarAoExercicio(exercicioId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/series/{id}")
    public SerieResponse atualizar(
        @PathVariable Long id,
        @RequestBody 
        @Valid UpdateSerieRequest request) {
        return serieService.atualizar(id, request);
    }

    @DeleteMapping("/api/series/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        serieService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
