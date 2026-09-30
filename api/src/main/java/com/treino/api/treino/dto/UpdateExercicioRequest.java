package com.treino.api.treino.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateExercicioRequest(

        @NotBlank(message = "O nome do exercício é obrigatório.")
        String nome,

        String observacao
) {}