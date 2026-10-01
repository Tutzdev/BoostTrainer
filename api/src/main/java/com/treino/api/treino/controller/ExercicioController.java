package com.treino.api.treino.controller;

import com.treino.api.treino.dto.CreateExercicioRequest;
import com.treino.api.treino.dto.ExercicioResponse;
import com.treino.api.treino.dto.UpdateExercicioRequest;
import com.treino.api.treino.service.ExercicioService;

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
public class ExercicioController {

    private final ExercicioService exercicioService;

    public ExercicioController(ExercicioService exercicioService) {
        this.exercicioService = exercicioService;
    }

    @PostMapping("/api/dias-treino/{diaTreinoId}/exercicios")
    public ResponseEntity<ExercicioResponse> adicionar(
        @PathVariable Long diaTreinoId,
        @RequestBody 
        @Valid CreateExercicioRequest request) {
        ExercicioResponse response = exercicioService.adicionarAoDiaTreino(diaTreinoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/exercicios/{id}")
    public ExercicioResponse atualizar(
        @PathVariable Long id,
        @RequestBody 
        @Valid UpdateExercicioRequest request) {
        return exercicioService.atualizar(id, request);
    }

    @DeleteMapping("/api/exercicios/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        exercicioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
