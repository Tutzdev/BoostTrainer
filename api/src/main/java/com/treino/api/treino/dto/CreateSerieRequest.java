package com.treino.api.treino.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateSerieRequest(

        @NotNull(message = "A quantidade de repetições é obrigatória.")
        @Positive(message = "A quantidade de repetições deve ser maior que zero.")
        Integer repeticoes,

        @PositiveOrZero(message = "A carga não pode ser negativa.")
        Double carga
) {}