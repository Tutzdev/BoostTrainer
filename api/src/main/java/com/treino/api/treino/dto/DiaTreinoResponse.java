package com.treino.api.treino.dto;

import com.treino.api.treino.domain.DiaSemana;

import java.util.List;

public record DiaTreinoResponse(
        Long id,
        DiaSemana dia,
        String nome,
        List<ExercicioResponse> exercicios
) {}