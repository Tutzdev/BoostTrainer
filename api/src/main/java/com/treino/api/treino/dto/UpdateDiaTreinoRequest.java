package com.treino.api.treino.dto;

import com.treino.api.treino.domain.DiaSemana;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateDiaTreinoRequest (
    
    @NotNull(message = "O dia da semana é obrigatório")
    DiaSemana dia,

    @NotBlank(message = "O nome do treino é obrigatório")
    String nome
) {}